import { Client } from '@elastic/elasticsearch';

export default (plugin: any) => {
  // ---------------------------------------------------------------------------
  // Transformer functions
  // These are available for selection in the Strapi Admin Elasticsearch UI.
  // ---------------------------------------------------------------------------
  plugin.config.transformers = {
    /**
     * Trims whitespace from string values.
     */
    trim: (value: string): string => {
      return typeof value === 'string' ? value.trim() : value;
    },

    /**
     * Converts HS code biginteger to a string so it can be stored both as a
     * long (for exact/range queries) and as a keyword (for prefix queries)
     * when used with a multi-field mapping.
     */
    hsCodeToString: (value: bigint | number | null): string | null => {
      if (value === null || value === undefined) return null;
      return String(value);
    },
  };

  // ---------------------------------------------------------------------------
  // Business profile search route
  //
  // Search fields (Elasticsearch):
  //   - companyName          (on BusinessProfile)
  //   - productName          (on CompanyProduct)
  //   - productKeywords      (on CompanyProduct)
  //   - productHSCode        (on CompanyProduct)
  //
  // All hits are resolved to BusinessProfile documentIds and returned.
  // The client then applies filters via Strapi REST:
  //
  //   Company filters:
  //     filters[selfReportedTradeMarkets][name][$eq]=<market>
  //     filters[averageTransactionValue][$eq]=<value>
  //     filters[primaryTradeRole][name][$eq]=<role>
  //     filters[relatedIndustries][name][$eq]=<industry>
  //
  //   Product filters (deep filter through relation):
  //     filters[companyProductListing][productType][name][$eq]=<type>
  //     filters[companyProductListing][productImportOrigins][name][$eq]=<origin>
  //
  // Usage: GET /api/elasticsearch/product-search?query=<term>
  // Response: { documentIds: string[], total: number }
  // ---------------------------------------------------------------------------
  let client: Client | null = null;

  const getClient = (): Client => {
    if (!client) {
      client = new Client({
        node: plugin.config.searchConnector.host,
        auth: {
          username: plugin.config.searchConnector.username,
          password: plugin.config.searchConnector.password,
        },
        tls: {
          ca: plugin.config.searchConnector.certificate,
          rejectUnauthorized: false
        }
      });
    }
    return client;
  };

  plugin.controllers['performSearch'].productSearch = async (ctx: any) => {
    const { query } = ctx.request.query as { query?: string };

    if (!query || query.trim() === '') {
      ctx.status = 400;
      ctx.body = { error: 'query parameter is required' };
      return;
    }

    const shouldClauses: any[] = [
      // BusinessProfile — company name match (highest boost)
      { match: { companyName:             { query, boost: 3 } } },
      // CompanyProduct — product field matches
      { match: { productName:             { query, boost: 2 } } },
      { match: { productKeywords:         { query } } },
      { match: { productShortDescription: { query } } },
      // productHSCode is stored as a string via hsCodeToString transformer
      { match: { productHSCode:           { query } } },
    ];

    try {
      const esResult = await getClient().search({
        index: plugin.config.indexAliasName,
        query: {
          bool: {
            should: shouldClauses,
            minimum_should_match: 1,
          },
        },
        _source: false, // documentIds are parsed from _id
        size: 100,
      });

      const businessProfileDocIds = new Set<string>();
      const companyProductDocIds: string[] = [];

      // ES _id format: "api::collection-name.collection-name::documentId"
      for (const hit of esResult.hits.hits) {
        const esId = hit._id as string;
        const docId = esId.split('::')[2];
        if (!docId) continue;

        if (esId.includes('business-profile')) {
          businessProfileDocIds.add(docId);
        } else if (esId.includes('company-product')) {
          companyProductDocIds.push(docId);
        }
      }

      // Resolve CompanyProduct documentIds → BusinessProfile documentIds
      if (companyProductDocIds.length > 0) {
        const products = await strapi
          .documents('api::company-product.company-product')
          .findMany({
            filters: { documentId: { $in: companyProductDocIds } } as any,
            populate: { product: { fields: ['documentId'] } } as any,
          });

        for (const p of products as any[]) {
          if (p.product?.documentId) {
            businessProfileDocIds.add(p.product.documentId);
          }
        }
      }

      ctx.body = {
        documentIds: Array.from(businessProfileDocIds),
        total: businessProfileDocIds.size,
      };
    } catch (err: any) {
      strapi.log.error('[product-search] Elasticsearch error:', err?.meta?.body ?? err);
      ctx.status = 500;
      ctx.body = { error: 'Search failed', detail: err?.meta?.body?.error ?? err?.message };
    }
  };

  plugin.routes['search'].routes.push({
    method: 'GET',
    path: '/product-search',
    handler: 'performSearch.productSearch',
  });

  return plugin;
};



import type { Core } from '@strapi/strapi';

const DRAFT_PUBLISH_COLLECTIONS = [
  'industries',
];

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    for (const table of DRAFT_PUBLISH_COLLECTIONS) {
      const knex = strapi.db.connection;

      // Find published rows that have no matching draft (published_at IS NULL) with same document_id
      const orphans = await knex(table)
        .whereNotNull('published_at')
        .whereNotIn(
          'document_id',
          knex(table).whereNull('published_at').select('document_id')
        )
        .select('*');

      if (orphans.length === 0) continue;

      const drafts = orphans.map(({ id: _id, published_at: _pa, ...rest }) => ({
        ...rest,
        published_at: null,
      }));

      await knex(table).insert(drafts);
      strapi.log.info(`[bootstrap] Created ${drafts.length} missing draft(s) in "${table}".`);
    }
  },
};

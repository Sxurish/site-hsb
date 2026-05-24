// Stub para futura integração com Notion API
// Setup:
//   npm install @notionhq/client
//   NOTION_TOKEN=... e NOTION_DATABASE_ID=... em .env.local
//
// import { Client } from '@notionhq/client';
// const notion = new Client({ auth: process.env.NOTION_TOKEN });

export interface NotionPipelineItem {
  id: string;
  name: string;
  stage: string;
  value: number;
  owner: string;
  lastUpdated: string;
}

export async function fetchPipeline(): Promise<NotionPipelineItem[]> {
  // TODO: implementar
  // const response = await notion.databases.query({
  //   database_id: process.env.NOTION_DATABASE_ID!,
  //   filter: { property: 'Stage', select: { is_not_empty: true } },
  //   sorts: [{ property: 'Last Updated', direction: 'descending' }],
  // });
  // return response.results.map(mapNotionToItem);
  throw new Error('Notion não configurado. Usando dados mockados.');
}

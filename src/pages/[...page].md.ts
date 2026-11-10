import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";

export const getStaticPaths: GetStaticPaths = async () => (await getCollection("docs")).filter((page) => !page.slug.startsWith("v0")).map((page) => ({ params: { page: page.slug }, props: { page } }));

export const GET: APIRoute = ({ props }) => new Response(`# ${props.page.data.title}\n\n${props.page.body}`);

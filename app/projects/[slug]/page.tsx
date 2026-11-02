import {ManagedProject} from '../../catalog-projects';
import {Shell} from '../../site';
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <Shell active="projects" catalogSlug={slug}><ManagedProject slug={slug}/></Shell>}

import Profile from '../../../media/[id]/profile';
export default async function EnglishMediaPage({params}:{params:Promise<{id:string}>}){const {id}=await params;return <Profile id={id} locale="en"/>}

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export type ChatGPTUser = { id: string; email: string; name: string };

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const id = requestHeaders.get('oai-authenticated-user-id');
  const email = requestHeaders.get('oai-authenticated-user-email');
  if (!id || !email) return null;

  let name = email;
  const encodedName = requestHeaders.get('oai-authenticated-user-full-name');
  if (encodedName && requestHeaders.get('oai-authenticated-user-full-name-encoding') === 'percent-encoded-utf-8') {
    try { name = decodeURIComponent(encodedName); } catch { name = email; }
  }
  return { id, email, name };
}

export async function requireChatGPTUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getChatGPTUser();
  if (!user) redirect(`/signin-with-chatgpt?return_to=${encodeURIComponent(returnTo)}`);
  return user;
}

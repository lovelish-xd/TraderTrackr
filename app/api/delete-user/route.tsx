import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const { userId } = await request.json();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return Response.json({ error: 'Supabase environment variables are not set.' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

  const { error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json({ message: 'User deleted successfully' });
}

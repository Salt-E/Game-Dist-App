// import { createClient } from '@supabase/supabase-js';

// export const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// );

// lib/supabase.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from './database.types';

// For client components
export const createClient = () => {
  return createClientComponentClient<Database>();
};

// For direct usage in server components
export const supabase = createClientComponentClient<Database>();
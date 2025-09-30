import supabase from "./supabase";


export async function login({email, password}) {
  const {data, error} = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function signup({ name, email, password, profile_pic }) {
  let publicUrl = null;

  if (profile_pic instanceof File) {
    const rawExt = profile_pic.name.includes('.') ? profile_pic.name.split('.').pop() : '';
    const ext = (rawExt || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const safeName = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const fileName = `dp-${safeName}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('profile_pic')
      .upload(fileName, profile_pic, {
        cacheControl: '3600',
        upsert: false,
        contentType: profile_pic.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      });
    if (uploadError) throw new Error(uploadError.message);

    const { data: pub } = supabase.storage.from('profile_pic').getPublicUrl(fileName);
    publicUrl = pub.publicUrl;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: publicUrl,
      },
    },
  });
  if (error) throw new Error(error.message);
  return data;
}

export async function getCurrentUser() {
  const {data: session, error} = await supabase.auth.getSession();
  if (!session.session) return null;

  // const {data, error} = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  return session.session?.user;
}
export async function logout() {
  const {error} = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
  return true;
}
// Visibility gate for the Tổng luận Thần học section (/tong-luan).
//
// While this is false, the /tong-luan routes 404 and the nav/homepage links stay hidden — so the
// section stays unpublished on Vercel while the owner proofreads the 35 chapters. Turn on locally
// with NEXT_PUBLIC_TONG_LUAN=1 (in .env.local, which is gitignored) to preview; flip the default
// to true once the proofreading tracker is signed off.
//
// Client-safe (no fs) so both server and client code can read it.
export const TONG_LUAN_ENABLED = process.env.NEXT_PUBLIC_TONG_LUAN === '1' ? true : false;

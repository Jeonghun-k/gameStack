// Supabase 클라이언트 초기화 파일
// 앱 전체에서 Supabase DB와 통신할 때 이 파일에서 내보낸 supabase 객체를 사용함

import { createClient } from '@supabase/supabase-js';

// .env 파일에 저장된 Supabase 프로젝트 URL과 익명 키를 가져옴
// VITE_SUPABASE_URL: Supabase 프로젝트 주소 (예: https://xxxx.supabase.co)
// VITE_SUPABASE_ANON_KEY: 공개 API 키 (로그인 없이도 RLS 정책 범위 내에서 사용 가능)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Supabase 클라이언트 생성 후 export
// 다른 파일에서 import { supabase } from '../lib/supabase' 로 불러와 사용
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

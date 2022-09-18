import { createContext, useContext } from "react";
import type { Session } from '@supabase/supabase-js';

const SessionContext = createContext<Session | null>(null)
export default SessionContext

export const useSession = () => useContext(SessionContext)

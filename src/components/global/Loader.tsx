import { Loader2 } from 'lucide-react';

export const Icons = {
  spinner: Loader2,
};

const Loader = () => {
  return (
    <Icons.spinner className="h-4 w-4 animate-spin" />
  )
}

export default Loader
import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect root path to the sign-in page
  redirect('/sign-in');
}

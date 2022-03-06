import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();
  
  const menuItems = [
    {
      href: '/',
      title: 'Homepage',
    },
    {
      href: '/about',
      title: 'About',
    },
    {
      href: '/contact',
      title: 'Contact',
    },
  ];

  return (
    <>
      <nav className="sidebar">
          <ul>
            {menuItems.map(({ href, title }) => (
              <li className='m-2' key={title}>
                <Link href={href}>
                  <a
                    className={router.asPath === href}
                  >
                    {title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
    </>
  )
}

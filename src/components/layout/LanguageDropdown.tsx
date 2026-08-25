import React from 'react';
import Link from 'next/link';
import { LANGUAGES } from '@/constants';

export function LanguageDropdown() {
  return (
    <li id="language-dropdown" className="dropdown">
      <a href="#language" className="dropdown-toggle" data-toggle="dropdown">
        <span className="famfamfam-flag-gb icon" />
        &nbsp;
        <span className="language-name">English</span>
        <span className="caret" />
      </a>

      <ul className="dropdown-menu dropdown-menu-with-footer">
        {LANGUAGES.map((lang) => (
          <li key={lang.code}>
            <Link href={lang.path}>
              <span className={lang.flagClass} />
              <span className="language-name">{lang.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}

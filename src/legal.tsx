import { Link } from 'react-router-dom'
import { usePreferences } from './preferences'
import { PageMeta } from './ui'

import { legalPages, type LegalPath } from './legal-content'

export function LegalPage({ path }: { path: LegalPath }) {
  const { t } = usePreferences()
  const { title, sections } = legalPages[path]
  return <div className="container page policy">
    <PageMeta title={t(title)} />
    <div className="page-heading"><h1>{t(title)}</h1><p>{t('Draft for legal review before launch.')}</p></div>
    {sections.map(([heading, body]) => <section key={heading}><h2>{t(heading)}</h2><p>{t(body)}</p></section>)}
    {path === '/terms' && <Link className="text-link" to="/shipping">{t('Shipping & Returns')}</Link>}
  </div>
}

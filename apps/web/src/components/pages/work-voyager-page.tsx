import { ProjectShowcase } from "@/components/work/project-showcase";
import type { AppLocale } from "@/i18n/routing";

export function WorkVoyagerPage({ locale }: { locale: AppLocale }) {
  return <ProjectShowcase locale={locale} projectKey="voyager" />;
}

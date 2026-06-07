import { fetchProjectBySlug } from '@/lib/cms-fetch';
import { notFound } from 'next/navigation';
import ProjectDetailClient from './ProjectDetailClient';
import { getProjectSchema } from '@/lib/structured-data';
import type { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  const title = project.title;
  const description = project.tagline || project.description;
  const ogImage = project.cover_image || '/og-image.png';

  return {
    title,
    description,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      type: 'website',
      title: `${title} | Dhruv Panchal`,
      description,
      url: `/work/${project.slug}`,
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export const revalidate = 300;

export default async function ProjectDetailPage({ params }: Props) {
  const project = await fetchProjectBySlug(params.slug);
  if (!project) {
    notFound();
  }

  const schema = getProjectSchema(project);

  return (
    <>
      <script
        id={`schema-project-${project.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProjectDetailClient project={project} />
    </>
  );
}

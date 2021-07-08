import { FiCalendar, FiUser } from 'react-icons/fi';
import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <div className={commonStyles.wrapper}>
      <div className={styles.logo}>
        <img src="/logo.svg" alt="logo" />
      </div>
      <div className={styles.posts}>
        <p className={styles['post-title']}>Como utilizar Hooks</p>
        <p className={styles['post-subtitle']}>
          Pensando m sicronização em vez de ciclos de vida.
        </p>
        <div className={styles['post-info']}>
          <div className={styles['created-at']}>
            <FiCalendar />
            <p>15 Mar 2021</p>
          </div>
          <div className={styles.author}>
            <FiUser />
            <p>Joseph Oliveira</p>
          </div>
        </div>
      </div>
      <button className={styles['hidden-posts']}>Carregar mais posts</button>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const data = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    { fetch: ['posts.title', 'posts.content'], pageSize: 20 }
  );
  return {
    props: {
      postsPagination: {
        next_page: data.next_page,
        results: data.results,
      },
    },
  };
};

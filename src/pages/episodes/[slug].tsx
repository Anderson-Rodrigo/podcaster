import { format, parseISO } from 'date-fns'
import { GetStaticPaths, GetStaticProps } from 'next'
import { api } from '../../services/api'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString'
import styles from './episode.module.scss'
import Image from 'next/image'
import Head from 'next/head'
import Link from 'next/link'
import { usePlayer } from '../../contexts/PlayerContexts'

type Episode = {
    id: string
    title: string
    thumbnail: string
    members: string
    duration: number
    durationAsString: string
    url: string
    publishedAt: string,
    description: string
}

type EpisodeProps = {
    episode: Episode
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer()

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type="button">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </button>
                </Link>
                <Image 
                    width={700} 
                    height={160} 
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>
            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>
            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}></div>        
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
          _limit: 2,
          _sort: 'published_at',
          _order: 'desc'
        }
      })

    const paths = data.map(episodes => {
        return {
            params: {
                slug: episodes.id
            }
        }
    })

    return {
        paths, //nao utiliza nenhum parametro de forma estatica - no momento da build nao gera nada de forma estatica
        fallback: 'blocking' //aqui muda o comportamento da pagin -- caso estiver como false, ele retorna 404 -- quando blocking na camada do node, só vai ser navagda,
    }//quando os dados estiverem sidos carregados, só vai renderizar a pagina quando todas as informações estiverem prontas
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 //24horas
    }
}
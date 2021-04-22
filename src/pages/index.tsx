import { GetStaticProps } from 'next'

type HomeProps = {  
  episodes: Array
}
//SSG gera a pagina de forma estatica
export default function Home(props){
  console.log(props)
  return (
    <div>
      <h1>Index</h1>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8,
  }
}

//exemplo de SSR controlado pelo next, para o front nao ficar toda vez fazer requisição
//sempre sera retornado essa info
// export default function Home(props){
//   console.log(props)
//   return (
//     <div>
//       <h1>Index</h1>
//     </div>
//   )
// }

// export async function getServerSideProps() {
//   const response = await fetch('http://localhost:3333/episodes')
//   const data = await response.json()

//   return {
//     props: {
//       episodes: data,
//     }
//   }
// }
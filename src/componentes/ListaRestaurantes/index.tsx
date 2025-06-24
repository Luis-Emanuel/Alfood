import { useEffect, useState } from 'react';
import IRestaurante from '../../interfaces/IRestaurante';
import style from './ListaRestaurantes.module.scss';
import Restaurante from './Restaurante';
import axios from 'axios';
import { IPaginacao } from '../../interfaces/IPaginacao';
import { Stack, Button, TextField, Typography, InputLabel, Select, MenuItem, Box } from '@mui/material';

interface IParametrosBusca {
  ordering?: string
  search?: string
}

const ListaRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([]);
  const [paginaAnterior, setPaginaAnterior] = useState('');
  const [proximaPagina, setProximaPagina] = useState('');

  // Buscas e filtros
  const [busca, setBusca] = useState<string>('');
  const [ordenacao, setOrdenacao] = useState('')


  const carregarDados = (url: string) => {
    axios.get<IPaginacao<IRestaurante>>(url)
      .then(resposta => {
        setRestaurantes(resposta.data.results)
        setPaginaAnterior(resposta.data.previous)
        setProximaPagina(resposta.data.next)
      })
      .catch(erro => {
        console.log(erro);
      })
  }

  useEffect(() => {
    carregarDados('http://localhost:8000/api/v1/restaurantes/');
  }, []);

  return (
    <section className={style.ListaRestaurantes}>
      <h1>Os restaurantes mais <em>bacanas</em>!</h1>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        {/* Campo busca */}
        <TextField label="Buscar restaurante" variant="outlined" value={busca} onChange={evento => setBusca(evento.target.value)} />

        {/* Filtro busca */}
        <Select 
          value={ordenacao}
          onChange={evento => setOrdenacao(evento.target.value)}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value="">
            <em>Padrão</em>
          </MenuItem>
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="nome">Nome</MenuItem>
        </Select>
      </Stack>


      {/* Conteúdo */}
      {/* {filtrados.length === 0 && busca.length > 0 && (
        <Typography variant="h6"
          color="error"
          align="center"
          sx={{ marginTop: 4 }}>
          Nenhum restaurante encontrado com esse nome.
        </Typography>
      )} */}

      {restaurantes?.map(item => <Restaurante restaurante={item} key={item.id} />)}
      <Stack spacing={2} direction="row">
        <Button variant="contained" onClick={() => carregarDados(paginaAnterior)} disabled={!paginaAnterior}>
          Página Anterior
        </Button>
        <Button variant="contained" onClick={() => carregarDados(proximaPagina)} disabled={!proximaPagina}>
          Próxima página
        </Button>
      </Stack>
    </section>
  )
}

export default ListaRestaurantes
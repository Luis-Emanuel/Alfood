import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";
import IRestaurante from "../../../interfaces/IRestaurante";

const FormularioPrato = () => {

  const [nomePrato, setNomePrato] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tagSelecionada, setTagSelecionada] = useState('')
  const [restauranteSelecionado, setRestauranteSelecionado] = useState('')
  const [imagem, setImagem] = useState<File | null>(null)


  const [tags, setTags] = useState<ITag[]>([])
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/')
      .then(resposta => setTags(resposta.data.tags));
    http.get<IRestaurante[]>('restaurantes/')
      .then(resposta => setRestaurantes(resposta.data))
  }, [])

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const formData = new FormData();
    formData.append('nome', nomePrato)
    formData.append('descricao', descricao)
    formData.append('tag', tagSelecionada)
    formData.append('restaurante', restauranteSelecionado)

    if (imagem) {
      formData.append('imagem', imagem)
    }

    http.request({
      url: 'pratos/',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }).then(() =>{
      alert('Prato cadastrado com sucesso!')
      setNomePrato('')
      setDescricao('')
      setTagSelecionada('')
      setRestauranteSelecionado('')
      setImagem(null)
    }).catch(error => console.error(error));
  }

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if (evento.target.files?.length) {
      setImagem(evento.target.files[0]);
    } else {
      setImagem(null)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
      <Typography component='h1' variant='h6'>Formulário de Pratos</Typography>
      <Box component='form' sx={{ width: "100%" }} onSubmit={aoSubmeterForm}>
        <TextField
          value={nomePrato}
          onChange={evento => setNomePrato(evento.target.value)}
          id="standard-basic"
          label="Nome do prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricao}
          onChange={evento => setDescricao(evento.target.value)}
          id="standard-basic"
          label="Descrição do prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="select-tag">Tag</InputLabel>
          <Select labelId="select-tag" value={tagSelecionada} onChange={event => setTagSelecionada(event.target.value)}>
            {tags.map(tag => (
              <MenuItem key={tag.id} value={tag.value}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel id="select-restaurante">Restaurante</InputLabel>
          <Select labelId="select-restaurante" value={restauranteSelecionado} onChange={evento => setRestauranteSelecionado(evento.target.value)}>
            {restaurantes.map(restaurante => (
              <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <input type="file" onChange={selecionarArquivo} />
        <Button fullWidth sx={{ marginTop: 1 }} type="submit" variant="outlined">Salvar</Button>
      </Box>
    </Box>
  )
}

export default FormularioPrato;
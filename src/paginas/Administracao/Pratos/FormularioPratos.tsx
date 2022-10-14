import { Box, Typography, TextField, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import http from "../../../http"
import IPrato from "../../../interfaces/IPrato"
import IRestaurante from "../../../interfaces/IRestaurante"
import ITag from "../../../interfaces/ITag"

const FormularioPratos = () => {

  const parametros = useParams()

  const [nomePrato, setNomePrato] = useState('')
  const [descricao, setDescricao] = useState('')

  const [tag, setTag] = useState('')
  const [restaurante, setRestaurante] = useState(0)

  const [imagem, setImagem] = useState<File | null>(null)

  const [tags, setTags] = useState<ITag[]>([])
  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

  
  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/')
    .then(resposta => setTags(resposta.data.tags))
    http.get<IRestaurante[]>('restaurantes/')
    .then(resposta => setRestaurantes(resposta.data))
  }, [])
  
  useEffect(() =>{
    if(parametros.id){
      http.get<IPrato>(`pratos/${parametros.id}/`)
      .then(resposta => {
        setNomePrato(resposta.data.nome)
        setDescricao(resposta.data.descricao)
        setTag(resposta.data.tag)
        setRestaurante(resposta.data.restaurante)
      })
    }
  }, [parametros])

  const selecionarArquivo = (evento: React.ChangeEvent<HTMLInputElement>) => {
    if(evento.target.files?.length){
      setImagem(evento.target.files[0])
    }else{
      setImagem(null)
    }
  }

  const aoSubmeterFor = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()

    const formData = new FormData();

    formData.append("nome", nomePrato)
    formData.append("descricao", descricao)
    formData.append("tag", tag)
    formData.append('restaurante', restaurante.toString())

    if(imagem){
      formData.append('imagem', imagem)
    }

    const url = parametros.id ? `pratos/${parametros.id}/` : 'pratos/'
    const method = parametros.id ? 'PUT' : 'POST'

    http.request({
      url,
      method,
      headers:{
        "Content-Type": "multipart/form-data"
      },
      data: formData
    })
    .then(()=> alert('Prato cadastrado com sucesso'))
    .catch(erro => console.log(erro))
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
      <Typography component="h1" variant="h6">Formulário de Restaurante</Typography>
      <Box component="form" sx={{ width: "100%" }} onSubmit={aoSubmeterFor}>
        <TextField
          value={nomePrato}
          onChange={evento => setNomePrato(evento.target.value)}
          label="Nome do prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />
        <TextField
          value={descricao}
          onChange={evento => setDescricao(evento.target.value)}
          label="Descrição do prato"
          variant="standard"
          fullWidth
          required
          margin="dense"
        />

        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-tag" >Tag</InputLabel>
          <Select labelId="select-tag" value={tag} onChange={evento => setTag(evento.target.value)}>
            {tags.map(tag => <MenuItem key={tag.id} value={tag.value}>
              {tag.value}
            </MenuItem>)}
          </Select>
        </FormControl>

        <FormControl margin="dense" fullWidth>
          <InputLabel id="select-restaurante">Restaurante</InputLabel>
          <Select labelId="select-restaurante" value={restaurante} onChange={evento => setRestaurante(Number(evento.target.value))}>
              {restaurantes.map( restaurante => <MenuItem key={restaurante.id} value={restaurante.id}>
                {restaurante.nome}
              </MenuItem>)}
          </Select>
        </FormControl>
        
        <input type='file' onChange={selecionarArquivo}/>

        <Button sx={{ marginTop: 1 }} type="submit" fullWidth variant="outlined">Salvar</Button>
      </Box>
    </Box>
  )
}
export default FormularioPratos
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import http from "../../../http";
import ITag from "../../../interfaces/ITag";

const FormularioPrato = () => {

  const [nomePrato, setNomePrato] = useState('')
  const [descricao, setDescricao] = useState('')
  const [tagSelecionada, settagSelecionada] = useState('')


  const [tags, setTags] = useState<ITag[]>([])

  useEffect(() => {
    http.get<{ tags: ITag[] }>('tags/')
      .then(resposta => setTags(resposta.data.tags))
  }, [])

  const aoSubmeterForm = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
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
          <InputLabel id="selec-tag"> Tag</InputLabel>
          <Select labelId="selec-tag" value={tagSelecionada} onChange={event => settagSelecionada(event.target.value)}>
            {tags.map(tag => (
              <MenuItem key={tag.id} value={tag.id}>
                {tag.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button fullWidth sx={{ marginTop: 1 }} type="submit" variant="outlined">Salvar</Button>
      </Box>
    </Box>
  )
}

export default FormularioPrato;
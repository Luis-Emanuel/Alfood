import { Button, TextField } from "@mui/material"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import IRestaurante from "../../../interfaces/IRestaurante"

const FormularioRestaurantes = () => {
  const parametros = useParams()

  useEffect(() => {
    if (parametros.id) {
      axios.get<IRestaurante>(`http://localhost:8000/api/v2/restaurantes/${parametros.id}/`)
        .then(resposta => setNomeRestaurante(resposta.data.nome))
    }
  }, [parametros])

  const [nomeRestaurante, setNomeRestaurante] = useState('')

  const aoSubmeterFor = (evento: React.FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    
    if (parametros.id) {
      axios.put(`http://localhost:8000/api/v2/restaurantes/${parametros.id}/`, {
        nome: nomeRestaurante
      })
        .then(() => {
          alert('Restaurante atulizado com sucesso')
        })
      } else {
        axios.post('http://localhost:8000/api/v2/restaurantes/', {
          nome: nomeRestaurante
      })
        .then(() => {
          alert('Restaurante cadastrado com sucesso')
        })
       }
  }

  return (
    <form onSubmit={aoSubmeterFor}>
      <TextField
        value={nomeRestaurante}
        onChange={evento => setNomeRestaurante(evento.target.value)}
        label="Nome do restaurante"
        variant="standard"
      />
      <Button type="submit" variant="outlined">Salvar</Button>
    </form>
  )
}
export default FormularioRestaurantes


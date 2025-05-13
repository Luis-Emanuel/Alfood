import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import IRestaurante from "../../../interfaces/IRestaurante";
import { Link as RouterLink } from "react-router-dom";
import http from "../../../http";


const AdministracaoRestaurantes = () => {

  const [restaurantes, setRestaurantes] = useState<IRestaurante[]>([])

  useEffect(() => {
    http.get<IRestaurante[]>("restaurantes/")
      .then(resposta => setRestaurantes(resposta.data))
  }, [])

  const excluir = (restauranteASerExcluido: IRestaurante) => {
    http.delete(`restaurantes/${restauranteASerExcluido.id}/`)
      .then(() => {
        const listaAtualizada = restaurantes.filter(restaurante => restaurante.id !== restauranteASerExcluido.id);
        setRestaurantes(listaAtualizada);
      })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              Nome
            </TableCell>
            <TableCell>
              Editar
            </TableCell>
            <TableCell>
              Excluir
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {restaurantes.map(restaurante => {
            return <TableRow key={restaurante.id}>
              <TableCell>
                {restaurante.nome}
              </TableCell>
              <TableCell>
                [<RouterLink to={`/admin/restaurantes/${restaurante.id}`}>editar</RouterLink>]
              </TableCell>
              <TableCell>
                <Button variant="outlined" color="error" onClick={() => excluir(restaurante)}>Excluir</Button>
              </TableCell>
            </TableRow>
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
export default AdministracaoRestaurantes;
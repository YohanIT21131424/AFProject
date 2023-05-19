import React, { useState, useEffect } from 'react'
import { Container, Grow, Grid, Paper, AppBar, TextField, Button } from '@material-ui/core'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import ChipInput from 'material-ui-chip-input'

import { fetchPostsBySearch } from '../services/posts'
import { getPost, getPosts, getPostsBySearch } from '../actions/posts'
import Pagination from '../components/Posts/Pagination'
import Posts from '../components/Posts/Posts/Posts.jsx'
import Layout from '../components/layout'
import Form from '../components/Posts/Form/Form'

import useStyles from '../components/Posts/Homet/styles'
import axios from 'axios'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

const Memo = () => {
  const [currentId, setCurrentId] = useState('')
  const dispatch = useDispatch()
  const query = useQuery()
  const navigate = useNavigate()
  const page = query.get('page') || 1
  const searchQuery = query.get('searchQuery')
  const [selectedPost, setSelectedPost] = useState(null)
  const classes = useStyles()
  //state
  const [search, setSearch] = useState('')
  const [tags, setTags] = useState([])

  useEffect(() => {
    dispatch(getPosts())
  }, [currentId, dispatch])

  const searchPost = () => {
    if (search.trim()) {
      console.log({ search })
      dispatch(getPostsBySearch(search))

      //navigate(`/posts/search?searchQuery=${search || 'none'}`);
    } else {
      navigate('/')
    }
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      // search post
      searchPost()
    }
  }

  const idSetter = async (id) => {
    const p = await axios.get(`http://localhost:4000/api/posts/${id}`).then((val) => {
      setSelectedPost(val.data)
    })
    console.log(p)
    setCurrentId(id)
  }

  const handleAdd = (tag) => setTags([...tags, tag])

  const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete))

  return (
    <Layout title="Posts">
      <Grow in>
        <Container maxWidth="xl">
          <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
            <Grid item xs={12} sm={6} md={9}>
              <Posts setCurrentId={idSetter} />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <AppBar className={classes.appBarSearch} position="static" color="inherit">
                <TextField name="search" variant="outlined" label="Search Memories" onKeyPress={handleKeyPress} fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
                <ChipInput style={{ margin: '10px 0' }} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Search Tags" variant="outlined" />
                <button onClick={searchPost} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Search
                </button>
              </AppBar>

              <Form currentId={currentId} setCurrentId={setCurrentId} selectedPost={selectedPost} />
              <Paper elevation={6}>
                <Pagination />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </Layout>
  )
}

export default Memo

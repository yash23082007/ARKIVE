import axios from 'axios'

const API_BASE = 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

export const extractConcepts = (text) =>
  api.post('/api/encoder/extract-concepts', { text }).then(res => res.data)

export const generateArchive = (concepts, title, redundancyLevel = 3) =>
  api.post('/api/encoder/generate-archive', { 
    concepts, 
    title, 
    redundancy_level: redundancyLevel 
  }, { 
    responseType: 'blob' 
  })

export const getArchives = () =>
  api.get('/api/archive').then(res => res.data)

export const getArchive = (id) =>
  api.get(`/api/archive/${id}`).then(res => res.data)

export const getSimulationSteps = (archiveId = null) =>
  api.get('/api/simulator/steps', { 
    params: archiveId ? { archive_id: archiveId } : {} 
  }).then(res => res.data)

export const getGraph = () =>
  api.get('/api/graph').then(res => res.data)

export const deleteArchive = (id) =>
  api.delete(`/api/archive/${id}`).then(res => res.data)

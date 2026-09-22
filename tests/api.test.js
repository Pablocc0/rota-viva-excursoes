import test from 'node:test'
import assert from 'node:assert/strict'
import { validState,ApiError } from '../server/api.js'
test('aceita estado completo',()=>{const state={clients:[],trips:[],sales:[],settings:{company:'Rota Viva'}};assert.equal(validState(state),state)})
test('recusa ids duplicados',()=>{assert.throws(()=>validState({clients:[{id:'1'},{id:'1'}],trips:[],sales:[],settings:{}}),ApiError)})

import test from 'node:test'
import assert from 'node:assert/strict'
import { validState,ApiError,preserveCommissions,withoutCommissions } from '../server/api.js'
test('aceita estado completo',()=>{const state={clients:[],trips:[],sales:[],settings:{company:'Rota Viva'}};assert.equal(validState(state),state)})
test('recusa ids duplicados',()=>{assert.throws(()=>validState({clients:[{id:'1'},{id:'1'}],trips:[],sales:[],settings:{}}),ApiError)})
test('oculta e preserva comissões para vendedores',()=>{const current={sales:[{id:'s1',total:100,commissionRate:12}]};const visible=withoutCommissions(current);assert.equal(visible.sales[0].commissionRate,undefined);const saved=preserveCommissions({sales:[{id:'s1',total:150,commissionRate:99},{id:'s2',total:50,commissionRate:30}]},current);assert.equal(saved.sales[0].commissionRate,12);assert.equal(saved.sales[1].commissionRate,undefined)})

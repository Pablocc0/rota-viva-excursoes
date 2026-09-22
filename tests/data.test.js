import test from 'node:test'
import assert from 'node:assert/strict'
import { cpfText,paidTotal,saleStatus,validCpf } from '../src/data.js'
test('formata e valida CPF',()=>{assert.equal(cpfText('52998224725'),'529.982.247-25');assert.equal(validCpf('529.982.247-25'),true);assert.equal(validCpf('111.111.111-11'),false)})
test('calcula pagamentos e status',()=>{const sale={total:300,payments:[{amount:100},{amount:200}]};assert.equal(paidTotal(sale),300);assert.equal(saleStatus(sale),'Pago');assert.equal(saleStatus({...sale,status:'Cancelada'}),'Cancelada')})

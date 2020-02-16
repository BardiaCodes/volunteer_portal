import React from 'react'
import ReactTable from 'react-table'

import * as R from 'ramda'
import { defaultFilterMethod } from 'lib/utils'
import { Field, Input, FauxInput } from '@zendeskgarden/react-forms'
import { Datepicker } from '@zendeskgarden/react-datepickers'
import { Button } from '@zendeskgarden/react-buttons'

import FilterGroup from '/components/FilterGroup'
import OfficeFilter from '/components/OfficeFilter'

import s from './main.css'

import 'style-loader!css-loader!react-table/react-table.css'
import styled from 'styled-components'

const InlineFauxInput = styled(FauxInput)`
  display: flex;
  align-items: center;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
`

const columnDefs = [
  {
    Header: 'Name',
    accessor: 'name',
    filterable: true,
  },
  {
    Header: 'Email',
    accessor: 'email',
  },
  {
    Header: 'Office',
    id: 'officeName',
    accessor: 'office.name',
  },
  {
    Header: 'Hours',
    accessor: 'hours',
  },
]

const containerProps = () => ({
  style: {
    border: 'none',
  },
})

const tableProps = () => ({
  style: {
    border: 'none',
  },
})

const theadProps = () => ({
  style: {
    boxShadow: 'none',
  },
})

const thProps = () => ({
  style: {
    border: 'none',
    borderBottom: '2px solid #eee',
    textAlign: 'left',
    padding: '15px 5px',
    boxShadow: 'none',
    fontWeight: 'bold',
  },
})

const trProps = () => ({
  style: {
    border: 'none',
  },
})

const tdProps = () => ({
  style: {
    border: 'none',
    borderBottom: '1px solid #eee',
    padding: 10,
  },
})

const tableExporter = (startDate, endDate, onStartChange, onEndChange, state, makeTable, instance) => {
  const headers = 'Name,Email,Office,Hours\n'

  const csv = state.pageRows.reduce(
    (acc, row) => (acc += `${row.name},${row.email},${row.officeName},${row.hours}\n`),
    headers
  )

  const octetStream = encodeURIComponent(csv)
  const today = new Date()

  return (
    <div>
      <div className={s.toolbar}>
        <FilterGroup>
          <OfficeFilter />
          <div>
            <Field>
              <InlineFauxInput>
                <strong>From:&nbsp;</strong>
                <Datepicker value={startDate} onChange={onStartChange} maxValue={today}>
                  <Input bare />
                </Datepicker>
              </InlineFauxInput>
            </Field>
          </div>
          <div>
            <Field>
              <InlineFauxInput>
                <strong>To:&nbsp;</strong>
                <Datepicker value={endDate} onChange={onEndChange} maxValue={today}>
                  <Input bare />
                </Datepicker>
              </InlineFauxInput>
            </Field>
          </div>
          <div>
            <a href={`data:application/octet-stream;filename=export.csv,${octetStream}`} download="export.csv">
              <Button>Export as CSV</Button>
            </a>
          </div>
        </FilterGroup>
      </div>
      {makeTable()}
    </div>
  )
}

const Reporting = ({ users, startDate, endDate, onStartChange, onEndChange }) => (
  <ReactTable
    columns={columnDefs}
    data={users}
    showPagination={false}
    defaultPageSize={users.length}
    pageSize={users.length}
    minRows={0}
    defaultFilterMethod={defaultFilterMethod}
    getProps={containerProps}
    getTableProps={tableProps}
    getTheadProps={theadProps}
    getTheadThProps={thProps}
    getTrGroupProps={trProps}
    getTrProps={trProps}
    getTdProps={tdProps}
  >
    {R.partial(tableExporter, [startDate, endDate, onStartChange, onEndChange])}
  </ReactTable>
)

export default Reporting

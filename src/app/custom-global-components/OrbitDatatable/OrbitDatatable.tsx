'use client';

import DataTable from 'react-data-table-component';
import { Checkbox, FormControl, Input } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import NoDataFound from '../NoDataFound/NoDataFound';
import TableSkeleton from './TableSkeleton';
import './OrbitDatatable.css';


interface OrbitDatatableProps {
    columns: any[],
    progressPending: boolean,
    data: [],
    onRowClick?: (row: any) => void,
    selectableRows: boolean,
    isRowDisabled?: (row: any) => boolean,
    onSelectedRowsChange?: (row: any) => void
    selectedRows?: [] | null,
    withExport?: boolean,
    isDense?: boolean,
    isSingleChoose?: boolean,
    maxSelectedRows?: number | null,
    selectableRowsNoSelectAll?: boolean
}

export default function OrbitDatatable({
    columns = [],
    progressPending = false,
    data = [],
    onRowClick,
    selectableRows = false,
    isRowDisabled,
    onSelectedRowsChange,
    selectedRows = [],
    withExport = false,
    isDense = false,
    isSingleChoose = false,
    maxSelectedRows = null,
    selectableRowsNoSelectAll = false
}: OrbitDatatableProps) {
    const [searchText, setSearchText] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [tableRefreshKey, setTableRefreshKey] = useState(0);

    const safeSelectedRows = Array.isArray(selectedRows) ? selectedRows.map(Number) : [];
    const handleSearch = (value: string) => setSearchText(String(value || '').toLowerCase());

    const filteredData = useMemo(() => {
        const q = (searchText || '').toLowerCase();
        return data.filter(item => {
            const parts = columns
                .filter((col: any) => typeof col.selector === 'function')
                .map((col: any) => {
                    try { return String(col.selector(item) || '') } catch { return '' }
                });

            if (parts.length === 0) {
                const { profile_picture, ...rest } = (item || {}) as any;
                parts.push(JSON.stringify(rest || {}));
            }

            return parts.join(' ').toLowerCase().includes(q);
        });
    }, [data, columns, searchText]);

    const handleRowSelected = useCallback(({ selectedRows: currentSelectedRows = [] }) => {
        if (maxSelectedRows && (currentSelectedRows.length > maxSelectedRows)) return alert(`You can only select a maximum of ${maxSelectedRows} rows.`);

        const eventIds = Array.isArray(currentSelectedRows) ? currentSelectedRows.map((r: any) => Number(r.id)) : [];
        const prevIds = safeSelectedRows.slice();
        const visibleIds = filteredData.map((r: any) => Number(r.id));
        const additions = eventIds.filter(id => !prevIds.includes(id));
        const removals = prevIds.filter(id => visibleIds.includes(id) && !eventIds.includes(id));

        let next = prevIds.filter(id => !removals.includes(id)).concat(additions);
        next = Array.from(new Set(next));

        const prevJson = JSON.stringify(prevIds);
        const nextJson = JSON.stringify(next);

        if (typeof onSelectedRowsChange === 'function' && prevJson !== nextJson) {
            onSelectedRowsChange(next);
        }
    }, [filteredData, safeSelectedRows, onSelectedRowsChange, maxSelectedRows]);

    useEffect(() => {
        if (searchText) {
            setSearchText(searchText);
        }

        return () => { };
    }, [searchText]);

    return <>
        {
            data.length > 0 &&
            <FormControl fullWidth sx={{ mb: 1 }}>
                <Input
                    id="email"
                    type="email"
                    className='custom-field-bg'
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    disableUnderline
                    size="small"
                    autoComplete='off'
                    placeholder='Search something...'
                />
            </FormControl>
        }

        {
            !progressPending && data.length <= 0
                ? <NoDataFound message={'No data found.'} />
                : <DataTable
                    keyField='key'
                    key={tableRefreshKey}
                    progressPending={progressPending}
                    progressComponent={<TableSkeleton columns={columns} />}
                    columns={columns}
                    data={filteredData}
                    paginationDefaultPage={currentPage}
                    paginationTotalRows={filteredData.length}
                    pagination
                    selectableRowsNoSelectAll={selectableRowsNoSelectAll}
                    onRowClicked={onRowClick}
                    dense={isDense}
                    highlightOnHover
                    selectableRowsHighlight
                    selectableRowsSingle={isSingleChoose}
                    selectableRowsComponent={<Checkbox />}
                    selectableRowDisabled={isRowDisabled}
                    selectableRows={selectableRows}
                    onSelectedRowsChange={handleRowSelected}
                    theme='dark'
                    selectableRowSelected={(row: any) => safeSelectedRows.includes(Number(row.id))}
                />
        }
    </>
}
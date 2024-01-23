import React from 'react'
import Grid from '../../../../common/grid'
import Arrow from '../../../../assets/images/Reporting/icons/arrows.svg'
import Select from '../../../../common/select'
import ChartComponent from '../../../../common/chart'

function Fronting() {
    const time = [
        { label: "march 2024", value: true },
        { label: "Inactive", value: false },
      ];
  return (
    <>
        <Grid>
            <div className='col-span-8'>
            </div>
            <div className='col-span-4'>
                <div className="bg-[#fff] rounded-[20px] p-3 my-4 border-[1px] border-[#D1D1D1]">
                    <p className='text-xl font-bold mb-3'>Years Comparison</p>
                    <ChartComponent />
                    <Grid className='!gap-1'>
                        <div className='col-span-6'>
                            <div className='border-2 p-2 rounded-xl border-[#D1D1D1]'>
                            <div className='flex'>
                                    <div className='bg-[#3D3D3D] mt-2 w-4 h-4 rounded-full'></div>
                                    <div className='ml-1'>
                                        <p className='text-xl font-bold '>$159.00</p>
                                        <p> 2023</p>
                                    </div>
                            </div>
                            </div>
                        </div>
                        <div className='col-span-6'>
                            <div className='border-2 p-2 rounded-xl border-[#D1D1D1]'>
                            <div className='flex'>
                                    <div className='bg-[#939393] mt-2 w-4 h-4 rounded-full'></div>
                                    <div className='ml-1'>
                                        <p className='text-xl font-bold '>$107.00</p>
                                        <p> 2022</p>
                                    </div>
                            </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid className='!gap-5 mt-5 '>
                        <div className='col-span-6 relative'>
                            <label className='text-[11px] text-[#727378] font-bold'>Select Current Year</label>
                            <Select
                            label=""
                            name="state"
                            placeholder=""
                            className="!bg-white"
                            className1='!text-sm !p-1'
                            options={time}
                        />
                        <img src={Arrow} className='absolute -right-5 top-9' alt='Arrow'/>
                        </div>
                        <div className='col-span-6'>
                            <label className='text-[11px] text-[#727378] font-bold'>Select Previous Year</label>
                            <Select
                            label=""
                            name="state"
                            placeholder=""
                            className="!bg-white"
                            className1='!text-sm !p-1'
                            options={time}
                        />
                        </div>
                    </Grid>
                </div>
            </div>
        </Grid>
    </>
  )
}

export default Fronting
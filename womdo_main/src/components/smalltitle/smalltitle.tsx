import React from 'react'

type TProps = {
    title?: string,
    className?: string,
}

const SmallTitle = (props: TProps) => {
    return (
        <div className={`small_title ${props.className || ""}`}>
            <h2>
                {props.title}
            </h2>
        </div>
    )
}

export default SmallTitle

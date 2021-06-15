export function Captured({ captured }) {
    return <div style={{ overflow: 'hidden', height: '25px' }}>
        {captured.map(c =>
            <div key={c}
                style={{ width: "25px", height: '25px', backgroundSize: '25px 25px', float: 'left', backgroundImage: `url('/assets/${c.slice(0, -1)}.svg')` }}>
            </div>
        )}
    </div>
}
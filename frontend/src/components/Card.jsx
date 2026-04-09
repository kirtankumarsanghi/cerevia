export default function Card({ title, subtitle, className = "", children }) {
	return (
		<section className={`panel ${className}`.trim()}>
			{(title || subtitle) && (
				<header className="panel-header">
					{title && <h3>{title}</h3>}
					{subtitle && <p>{subtitle}</p>}
				</header>
			)}
			{children}
		</section>
	);
}

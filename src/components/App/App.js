import { h, Component } from 'preact';
import s from './App.css';
import Color from 'color';
import classnames from 'classnames';


const LayerImg = ({className, ...otherProps}) => (
	<img
		{...otherProps}
		className={classnames(s.layer, className)}
		alt=""
		role="presentation"
	/>
);

const FilterControl = ({label, handleInput, value}) => (
	<label>
		{label}
		<input
			type="range"
			min="0"
			max="2"
			value={value}
			onInput={handleInput}
			step="0.01"
		/>
	</label>
);

class HueGradientCanvas extends Component {
	componentDidMount() {
		this.ctx = this.canvas.getContext('2d');
		this.drawHueGradient();
	}

	drawHueGradient() {
		const {canvas, ctx} = this;
		const {baseColor} = this.props;

		const color = Color(baseColor);
		const step = 360 / canvas.width;
		let i = canvas.width;

		while (i--) {
			ctx.fillStyle = color.rotate(i * step).string();
			ctx.fillRect(i, 0, 1, 1)
		}
	}

	render({width = 720, ...otherProps}) {
		return (
			<canvas
				{...otherProps}
				ref={(el) => this.canvas = el}
				height="1"
				width={width}
			/>
		)
	}
}

const HueControl = ({style, value, baseColor, handleInput}) => (
	<div className={s.hueSliderWrapper} style={style}>
		<HueGradientCanvas
			baseColor={baseColor}
			className={s.hueSliderBackground}
		/>
		<input
			type="range"
			min="0"
			max="360"
			step="1"
			className={s.hueSlider}
			value={value}
			onInput={handleInput}
		/>
	</div>
);

const Display = ({filter}) => (
	<div className={s.layerWrapper}>
		<LayerImg
			src="images/layers/lighting.png"
			className={s.lightingLayer}
		/>
		<LayerImg
			src="images/layers/active.png"
			className={s.activeLayer}
			style={{filter}}
		/>
		<LayerImg
			src="images/layers/background.jpg"
			className={s.backgroundLayer}
		/>
	</div>
);

class App extends Component {

	// Filter ids match CSS filters exactly.
	filters = [
		{
			id: 'saturate',
			label: 'Colourfulness'
		},
		{
			id: 'brightness',
			label: 'Brightness'
		},
		{
			id: 'contrast',
			label: 'Vibrancy'
		},

	];

	state = {
		filters: {
			hue: 0,
			saturate: 1,
			brightness: 1,
			contrast: 1
		}
	};

	getFilterCSSString() {
		return this.filters
			.map(({id}) => `${id}(${this.state.filters[id]})`)
			.join(' ');
	}

	render(props, {filters}) {
		const filterString = this.getFilterCSSString();
		return (
			<div className={s.appWrapper}>
				<Display
					filter={`${filterString} hue-rotate(${filters.hue}deg)`}/>
				<HueControl
					baseColor="#ffd380"
					handleInput={this.linkState('filters.hue')}
					value={filters.hue}
					style={{filter: filterString}}
				/>
				<div>
					{this.filters.map(({id, label}) => (
						<FilterControl
							label={label}
							value={filters[id]}
							handleInput={this.linkState(`filters.${id}`)}
						/>
					))}
				</div>
			</div>
		)
	}
}

export default App;

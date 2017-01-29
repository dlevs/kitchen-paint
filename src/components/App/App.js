import { h, Component } from 'preact';
import uniqueId from 'lodash/uniqueId';
import range from 'lodash/range';
import style from './App.css';
import Color from 'color';

const Layer = ({name, styles, fileExt = 'png'}) => (
	<img
		style={styles} //TODO: Rename "style" import to not conflict here
		src={`images/layers/${name}.${fileExt}`}
		alt=""
		class={`${style.layer} ${style[name + 'Layer']}`}
		// TODO: OK role?
		role="presentation"
	/>
);

class Filter extends Component {
	componentWillMount() {
		this.id = uniqueId('input');
	}

	render({label, filter, handleInput, value}) {
		return (
			<div>
				<label for={this.id}>{label}</label>
				<input
					id={this.id}
					type="range"
					class="js-filter-control"
					data-filter="saturate"
					min="0"
					max="2"
					value={value}
					onInput={handleInput}
					step="0.01"
				/>
			</div>
		)
	}
}


// TODO: configurable per image
const BASE_COLOR = '#ffd380';

class HueGradientCanvas extends Component {
	componentDidMount() {
		this.ctx = this.canvas.getContext('2d');
		this.ctx.translate(0.5, 0.5);
		this.drawHueGradient();
	}

	drawHueGradient() {
		const {canvas, ctx} = this;
		const color = Color(BASE_COLOR);
		const width = canvas.width;
		const step = 360 / width;

		for (let i = 0; i < width; i++) {
			console.log(i)
			console.log(i * step)
			ctx.fillStyle = color.rotate(i * step).string();
			ctx.fillRect(i, 0, 1, 1)
		}
	}

	render(props) {
		return <canvas
			{...props}
			ref={(el) => this.canvas = el}
			height="1"
			width="720"
		/>
	}
}


const HueSlider = ({styles, value, handleInput}) => (
	<div class={style.hueSliderWrapper} style={styles}>
		<HueGradientCanvas class={style.hueSliderBackground}/>
		<input
			type="range"
			min="0"
			max="360"
			step="1"
			class={style.hueSlider}
			value={value}
			onInput={handleInput}
		/>
	</div>
);

// const filters = [
// 	{
// 		id: 'hue',
// 		min: 0,
// 		max: 360,
// 		unit: 'deg'
// 	},
//
// ];

class App extends Component {
	state = {
		filters: {
			hue: 0,
			saturate: 1,
			brightness: 1,
			contrast: 1
		}
	};

	componentWillUpdate() {
		console.log(this.state)
	}

	render(props, {filters}) {
		const filterString = `saturate(${filters.saturate}) brightness(${filters.brightness}) contrast(${filters.contrast})`;

		return (
			<div class={style.appWrapper}>
				<div class="content-wrapper">
					<div class={style.layerWrapper}>
						<Layer name="lighting"/>
						<Layer name="active"
							   styles={{filter: `${filterString} hue-rotate(${filters.hue}deg)`}}/>
						<Layer name="background" fileExt="jpg"/>
					</div>
					<HueSlider
						handleInput={this.linkState('filters.hue')}
						value={filters.hue}
						styles={{filter: filterString}}
					/>
					<div class="repaint-controls">
						<Filter
							filter="saturate"
							label="Colourfulness"
							value={filters.saturate}
							handleInput={this.linkState('filters.saturate')}
						/>
						<Filter
							filter="brightness"
							label="Brightness"
							value={filters.brightness}
							handleInput={this.linkState('filters.brightness')}
						/>
						<Filter
							filter="contrast"
							label="Vibrancy"
							value={filters.contrast}
							handleInput={this.linkState('filters.contrast')}
						/>
					</div>

					<div class="js-repaint-style"></div>
				</div>
			</div>
		)
	}
}

export default App;

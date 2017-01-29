import { h, Component } from 'preact';
import uniqueId from 'lodash/uniqueId';
import range from 'lodash/range';
import style from './App.css';

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

const Swatch = ({hue}) => (
	// TODO: Button or slider here. Not just <li/>
	// TODO: If this is decorational only, use divs
	// TODO: Use canvas :)
	<li
		class={style.swatch}
		style={{
			// TODO: Prefixing
			filter: `hue-rotate(${hue}deg)`
		}}
		// TODO: is this one needed?
		data-hue={hue}
	/>
);

const SwatchList = ({steps}) => {
	const step = 360 / steps;
	return (
		<ul class={style.swatchList}>
			{range(steps).map((value, i) => (
				<Swatch
					hue={Math.round(i * step)}
					isSelected={i === 0}
				/>
			))}
		</ul>
	);
};

const HueSlider = ({styles, value, handleInput}) => (
	<div class={style.hueSliderWrapper} style={styles}>
		<SwatchList steps={100}/>
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
						<Layer name="active" styles={{filter: `${filterString} hue-rotate(${filters.hue}deg)`}}/>
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

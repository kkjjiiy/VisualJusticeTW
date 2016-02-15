var DashBoard = React.createClass({

	graphs: 
		(function() {
			return {
				barGraph: new barGraphClass(),
				lineGraph: new lineGraphClass(),
			}
		})(),

	componentDidMount: function() {
		// this.graphs.tip = new tipClass();
		// this.graphs.tip.appendDotMouseOver('本年執行人數');
		// this.graphs.tip.appendBarMouseOver('本年執行人數');
	},

	render: function() {

		return (
			<div id="PANEL">
				<DashBoardSide />
				<ChartPanel 
					barGraph={this.graphs.barGraph} 
					lineGraph={this.graphs.lineGraph} />
			</div>
		)
	}
});

var ChartPanel = React.createClass({

	tip: new tipClass(),

	getInitialState: function() {
		return {
			dataSource: '/correction/監獄人數概況.csv',
			dataOption: '本年執行人數',
			xAxis: '民國',
			yAxis: '人數(仟人)'
		}
	},

	componentDidMount: function() {

		var bG = this.props.barGraph,
			lG = this.props.lineGraph,
			t  = this.tip;

		console.log(d3.select('#PANEL'));

		bG.initializeAPad()
			.setChartSize()
			.setOutPadding(10)
			.setStep(10)
			.drawingData('/correction/監獄人數概況.csv', '民國', '人數(仟人)', '本年執行人數')
				.then(function(jsonOutput) {

					t.initTips();

					lG.inheritPad(
						bG.pad, 
						bG.padHeight, 
						bG.padWidth, 
						bG.padPadding
						)
							.setChartSize()
								.plotBars(
									jsonOutput.data,
									jsonOutput.pad, 
									null,
									jsonOutput.barWidth/2
								).then(function(o) {

									lG.linePath = o.line;
									lG.lineDots = o.dots; 
									lG.areaUnderLine = o.area;
									lG.hide().hideUnderArea();
									// whichDisplayed();

									t.appendDotMouseOver('本年執行人數');
									t.appendBarMouseOver('本年執行人數');
									console.log('finished drawing');
								});

			});

	},

	render: function() {
		return (
			<div id='DISPLAY_PANEL' className='b20-col-md-16'>

			</div>
		)
	}
});





var DashBoardSide = React.createClass({
	render: function() {
		return(
			<header id="DASHBOARD_HDR" className="b20-col-md-4 b12-row-md-12">
				<Logo />
				<StatTitle />
				<StatNav />
				<SideFoot />
			</header>
		)
	}
});

var Logo = React.createClass({
	render: function() {
		return (
			<div id="LOGO-WRAPPER" className="b12-col-md-12 b15-row-md-5 hdr-div">
				<div id="LOGO" className="b12-col-md-12 b12-row-md-12"></div>
			</div>
		)
	}
});

var StatTitle = React.createClass({
	render: function() {
		return (
			<div className="b12-col-md-12 b15-row-md-1 hdr-div">
				<img id="TITLE" src="./src/correctStatTitle.png" />
			</div>
		)
	}
});

var StatNav = React.createClass({
	render: function() {
		return (
			<nav id="NAVI" className="b12-col-md-12 b15-row-md-8 hdr-div">
				<StatFilter />
			</nav>
		)
	}
});


var StatFilter = React.createClass({

	getInitialState: function() {
		return {
			
			current: {
				topic: '監獄人數概況',
				subTopic: '本年執行人數',
				filter: '總數',
				chartType: '長條圖'
			},
			filterNames: [
				'選擇主題',
				'選擇類別',
				'選擇成分',
				'選擇圖形'
			],

			menuDisplayedStatus: [
				false, false, false, false
			],
			// currentDisplayedMenuIndex: 0,

			fields: [
				{
					topic: '監獄人數概況',
					content: {
						subTopics: [
							{
								name: '本年執行人數',
								compos: [
									"總數"
								],
								availableChartTypes: [
									'長條圖',
									'折線圖',
									'面積圖'
								]
							},
							{
								name: '本年入監人數',
								compos: [
									"總數"
								],
								availableChartTypes: [
									'長條圖',
									'折線圖',
									'面積圖'
								]
							},
							{
								name: '新入監人數',
								compos: [
									"總數"
								],
								availableChartTypes: [
									'長條圖',
									'折線圖',
									'面積圖'
								]
							},
							{
								name: '本年出獄人數',
								compos: [
									"總數"
								],
								availableChartTypes: [
									'長條圖',
									'折線圖',
									'面積圖'
								]
							},
							{
								name: '本年年底留監人數',
								compos: [
									"總數"
								],
								availableChartTypes: [
									'長條圖',
									'折線圖',
									'面積圖'
								]
							}
						]
					}
				},
				{
					topic: '新入監資料概覽',
					content: {
						subTopics: [

						]
					}
				}
			]
		}
	},

	refeshMenu: function(displayedMenuIndex) {

		var s = [false, false, false, false];

		s[displayedMenuIndex] = true;

		this.setState({
			menuDisplayedStatus: s
		});

	},

	render: function() {

		var l = this.state.filterNames.length,
			fieldsets = [],
			c = this.state.current,
			index = 
				this.state.fields.findIndex(
					function(field, index) {
						if ( field.topic===c.topic ) return true 
					}),

			topicList = 
				this.state.fields.map(function(obj) { return obj.topic }),

			subTopicList = 
				this.state.fields[index]
					.content.subTopics.map(
						function(obj) { return obj.name }),

			// otherList contains the filters and avialable chart types
			otherList = 
				this.state.fields[index]
					.content.subTopics.find(
						function(obj) { 
							if (obj.name === c.subTopic)
								return true
						}),

			// Mapping the state's current into an array
			currentStates = 
				Object.keys(this.state.current)
					.map(function(key) { return c[key] }),

			// Mapping the list into the array for generating the menus
			menus = 
				[topicList, subTopicList, otherList.compos, otherList.availableChartTypes];

		for (let i=0;i<l;i++) {

			fieldsets.push(
				<StatFilterField 
					key={i}
					index={i}
					filterName={this.state.filterNames[i]} 
					fieldName={currentStates[i]}
					fieldMenu={menus[i]}
					clickEvt={this.refeshMenu}
					menuIsDisplayed={this.state.menuDisplayedStatus[i]}

					/>
			);
		}
		
		return (
			<form id="FILTER" className="b15-row-md-15">
				<div id="FILTER-TITLE" className="b15-row-md-1">
					<span className="ver-helper"></span>
					<span style={{verticalAlign: 'middle'}}>資料選擇</span>
				</div>
				<div className="b12-col-md-12 b15-row-md-14">
					{ fieldsets }
				</div>
			</form>
		)
	}
});

var StatFilterField = React.createClass({

	getInitialState: function() {
		return {
			menuIndex: null,
			isMenuDisplayed: null,
			selectedOption: null
		}
	},

	componentWillMount: function() {
		this.setState({
			menuIndex: this.props.index,
			isMenuDisplayed: this.props.menuIsDisplayed,
			selectedOption: this.props.fieldName
		});
	},

	shouldComponentUpdate: function(nextProps, nextStates) {
		
		if ( this.state.isMenuDisplayed !== nextStates.isMenuDisplayed ) return true
		else if ( this.state.selectedOption !== nextStates.selectedOption ) return true
		else return false
		
	},

	componentWillReceiveProps: function(nextProps) {
		console.log('state filer field receives props');
		this.setState({
			isMenuDisplayed: nextProps.menuIsDisplayed
		});
	},

	// Click for displaying the hidden menu
	displayMenu: function(e) {

		// Pass the index of the displayed menu to the parent
		this.props.clickEvt(this.state.menuIndex);

		this.setState({
			isMenuDisplayed: !this.state.isMenuDisplayed
		});
	},

	// Click for updating the seleted option on the button
	selectOption: function(optionStr) {

		this.setState({
			isMenuDisplayed: !this.state.isMenuDisplayed,
			selectedOption: optionStr
		});
	},

	render: function() {

		return (
			<fieldset className="b12-col-md-12 b12-row-md-3 formblock-fieldset">
				<div className="b12-col-md-12 b12-row-md-12">
					<span className="ver-helper"></span>
					<div className="dropdown-group">
						<legend className="dropdown-title">
							<span>{ this.props.filterName }</span>
						</legend>
						<div className="dropdown">
							<StatFilterBtn 
								clickEvt={ this.displayMenu } 
								name={ this.state.selectedOption }/>
							<StatFilterMenu 
								clickEvt={ this.selectOption }
								displayed={ this.state.isMenuDisplayed }
								menu={ this.props.fieldMenu }/>
						</div>
					</div>
				</div>
			</fieldset>
		)
	}
});

var StatFilterBtn = React.createClass({

	getInitialState: function() {
		return {
			currentOption: null
		}
	},

	componentWillMount: function() {
		this.setState({
			currentOption: this.props.name
		});
	},

	render: function() {

		return (
			<button className="dropdown-btn" 
					type="button" onClick={ this.props.clickEvt }>
				<span className="dropdown-txt">{ this.props.name }</span>
				<span className="dropdown-caret"></span>
			</button>
		)
	}
});

var StatFilterMenu = React.createClass({

	clickHandler: function(e) {

		this.props.clickEvt(e.target.innerHTML);
	},

	render: function() {
		console.log('Menu Displayed:');
		console.log(this.props.displayed);

		var items = [],
			className = 
				this.props.displayed ?
					'dropdown-menu displayed': 'dropdown-menu';

		for (let i in this.props.menu) {
			items.push(
				<StatFilterMenuItem 
					key={i} 
					clickEvt={ this.clickHandler }
					name={ this.props.menu[i] }/>);
		}

		return (
			<ul className={ className } >
				{ items }
			</ul>
		)
	}
});

var StatFilterMenuItem = React.createClass({
	render: function() {
		return (
			<li onClick={ this.props.clickEvt }>
				{ this.props.name }
			</li>
		)
	}
});


var SideFoot = React.createClass({
	render: function() {
		return (
			<div className="b12-col-md-12 b15-row-md-1 hdr-div hdr-div--txt-mid">
				<span className="ver-helper"></span>
				<a id="HOME-LINK" href="">vjtw.org</a>
			</div>
		)
	}
});

ReactDOM.render(<DashBoard />, document.getElementById("CONTAINER"));
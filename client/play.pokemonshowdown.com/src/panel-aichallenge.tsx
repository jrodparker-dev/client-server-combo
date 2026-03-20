/**
 * AI challenge setup popup.
 *
 * @license AGPLv3
 */

class AIChallengePanel extends PSRoomPanel {
	state = BattleAI.getChallengeSelection() || {
		format: '[Gen 7] OU',
		playerTeamKey: '',
		aiTeamKey: '',
	};

	changeFormat = (e: Event) => {
		this.setState({format: (e.target as HTMLButtonElement).value});
	};
	changePlayerTeam = (e: Event) => {
		this.setState({playerTeamKey: (e.target as HTMLButtonElement).value});
	};
	changeAITeam = (e: Event) => {
		this.setState({aiTeamKey: (e.target as HTMLButtonElement).value});
	};
	save = (e: Event) => {
		e.preventDefault();
		BattleAI.saveChallengeSelection(this.state as AIChallengeSelection);
		this.forceUpdate();
	};
	startBattle = () => {
		const formatid = ('' + this.state.format).toLowerCase().replace(/[^a-z0-9]+/g, '');
		const format = BattleFormats[formatid];
		const presetFormat = !!format?.team;
		const playerTeam = PS.teams.byKey[this.state.playerTeamKey] || null;
		const aiTeam = PS.teams.byKey[this.state.aiTeamKey] || null;
		if (!presetFormat && (!playerTeam || !aiTeam)) {
			PS.alert("Select both a player team and an AI team before starting the battle.");
			return;
		}
		BattleAI.saveChallengeSelection(this.state as AIChallengeSelection);
		PS.send(`|/challengeai ${JSON.stringify({
			format: this.state.format,
			playerTeam: presetFormat ? '' : playerTeam?.packedTeam || '',
			aiTeam: presetFormat ? '' : aiTeam?.packedTeam || '',
		})}`);
	};

	renderReport(report: AIMatchupReport) {
		const renderOption = (option: AIScoredOption) => <li>
			<strong>{option.name}</strong> <small>({option.score.toFixed(1)})</small>
			{option.reasons.length > 0 && <div><small>{option.reasons.join(' ')}</small></div>}
		</li>;
		return <div class="mainmessage" style="margin-top: 12px;">
			<h3>Scouting report</h3>
			<p><strong>Format:</strong> {report.format}</p>
			<p><strong>Your team:</strong> {report.playerTeam}<br />
			<strong>AI team:</strong> {report.aiTeam}</p>
			{report.bestPlayerLead && <div>
				<h4>Best player lead</h4>
				<p><strong>{report.bestPlayerLead.lead}</strong></p>
				<ul>{report.bestPlayerLead.options.map(renderOption)}</ul>
			</div>}
			{report.bestAILead && <div>
				<h4>Best AI lead</h4>
				<p><strong>{report.bestAILead.lead}</strong></p>
				<ul>{report.bestAILead.options.map(renderOption)}</ul>
				<h4>Likely AI switch pivots</h4>
				<ul>{report.bestAILead.switches.map(renderOption)}</ul>
			</div>}
			<h4>Preview notes</h4>
			<ul>{report.teamPreviewNotes.map(note => <li>{note}</li>)}</ul>
			<p><small>The AI logic file also includes a training program you can run with <code>npm run train-ai -- &lt;folder&gt;</code> after dropping replay HTML files into a folder.</small></p>
		</div>;
	}

	render() {
		const room = this.props.room;
		const playerTeam = PS.teams.byKey[this.state.playerTeamKey] || null;
		const aiTeam = PS.teams.byKey[this.state.aiTeamKey] || null;
		const report = BattleAI.analyzeTeamMatchup(this.state.format, playerTeam, aiTeam);

		return <PSPanelWrapper room={room} width={720}>
			<form class="pad" onSubmit={this.save}>
				<h2>Challenge AI</h2>
				<p>Pick one of your teambuilder teams for yourself and one for the in-client AI brain to study. This seeds the challenge selection, persists it locally, and generates a scouting report using type matchups, move data, ability data, item data, switching heuristics, and replay-trained weights.</p>
				<p>
					<label class="label">Format:<br />
						<button
							name="format" value={this.state.format}
							class="select formatselect" data-href="/formatdropdown" onChange={this.changeFormat}
						>{this.state.format}</button>
					</label>
				</p>
				<p>
					<label class="label">Your team:<br />
						<button
							name="playerTeam" value={this.state.playerTeamKey}
							class="select teamselect" data-href="/teamdropdown" data-format={PS.teams.teambuilderFormat(this.state.format)}
							onChange={this.changePlayerTeam}
						>
							{PS.roomTypes['teamdropdown'] && <TeamBox team={playerTeam} noLink />}
						</button>
					</label>
				</p>
				<p>
					<label class="label">AI team:<br />
						<button
							name="aiTeam" value={this.state.aiTeamKey}
							class="select teamselect" data-href="/teamdropdown" data-format={PS.teams.teambuilderFormat(this.state.format)}
							onChange={this.changeAITeam}
						>
							{PS.roomTypes['teamdropdown'] && <TeamBox team={aiTeam} noLink />}
						</button>
					</label>
				</p>
				<p>
					<button class="button" type="submit"><i class="fa fa-save"></i> Save AI challenge setup</button> {}
					<button class="button" type="button" onClick={this.startBattle}><strong>Start Battle</strong></button> {}
					<button class="button" type="button" name="closeRoom" value={room.id}><i class="fa fa-times"></i> Close</button>
				</p>
				{this.renderReport(report)}
			</form>
		</PSPanelWrapper>;
	}
}

PS.roomTypes['aichallenge'] = {
	title: 'Challenge AI',
	Component: AIChallengePanel,
};
PS.updateRoomTypes();

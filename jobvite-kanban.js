if(typeof window.jobviteKanbanLoaded == "undefined") {

	window.jobviteKanbanLoaded = true;
	
	var styles = " \
		div.candidate { border: solid 1px #000 !important; border-radius: 5px; margin: 5px 5px; font-size: 12px; width: 170px; background: #edf4fa; padding: 3px; cursor: pointer; }\
		div.longInactivity { background: #d490a4 !important; } \
		#candidateDialog { overflow: scroll; height: 500px; width: 700px; margin-top: 30px; } \
		div.candidateName {float: left; width: 150px; font-weight: bold; } \
		div.candidateActivityDate {float: right; } \
		div.candidateSource {clear: both; } \
		#candidateDialog th { width: 170px; } \
	";
	
	$("head").append("<style>" + styles + "</style>");
	
	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/jsrender/0.9.71/jsrender.js", function() {
		var candidates = $("#jv-searchCandidateGrid tr").not("#jv-gridHeader").map(function(key, item) {
								var obj = {};
								obj.link = $(item).find(".jv-candidateName a").attr("href");
								obj.name = $(item).find(".jv-candidateName a").text().trim();
								obj.status = $(item).find(".jv-candidateStatus a.candidateStatusValue").text().trim();
								obj.source = $(item).find(".jv-candidateSource").text().trim();
								obj.lastActivity = Date.parse($(item).find(".jv-candidateActivity").text().trim());
								obj.daysSinceLastActivity = Math.floor((new Date() - obj.lastActivity) / 86400000);
	
								return obj;
						});

		var candidatesByStatus = {};

		for(i = 0; i < candidates.length; i++) {
			var status = candidates[i].status;
	
			if(typeof candidatesByStatus[status] == "undefined") {
				candidatesByStatus[status] = [];
			}
	
			candidatesByStatus[status].push(candidates[i]);
		}

		var statusOrder = ["New", "Submitted to Hiring Manager", "Resume Reviewed", "Recruiter Screen", "Hiring Manager Phone Interview", "Approved by Hiring Manager", "Onsite Interview"];
	
		var allStatuses = Object.keys(candidatesByStatus);

		for(i = 0; i < allStatuses.length; i++) {
			if(statusOrder.indexOf(allStatuses[i]) == -1) {
				statusOrder.push(allStatuses[i]);
			}
		}

		var dialogDiv = $("<div id='candidateDialog'>");

		var table = $("<table>");
		dialogDiv.append(table);

		var headerRow = $("<tr>");
		table.append(headerRow);

		for(i = 0; i < statusOrder.length; i++) {
			headerRow.append("<th>" + statusOrder[i] + "</th>");
		}

		var candidateRow = $("<tr>");
		table.append(candidateRow);

		var candidateCell = $.templates("<div data-link='{{:link}}' class='candidate {{if daysSinceLastActivity > 5}}longInactivity{{/if}}'> \
											<div class='candidateName'> \
												{{:name}} \
											</div> \
											<div class='candidateActivityDate'> \
												{{:daysSinceLastActivity}} \
											</div> \
											<div class='candidateSource'> \
												{{:source}} \
											</div> \
										</div>");

		for(i = 0; i < statusOrder.length; i++) {

			var statusColumn = $("<td>");
			candidateRow.append(statusColumn);
	
			if(typeof candidatesByStatus[statusOrder[i]] == "undefined") continue;
	
			var statusCandidates = candidatesByStatus[statusOrder[i]];
	
			for(j = 0; j < statusCandidates.length; j++) {
				statusColumn.append(candidateCell.render(statusCandidates[j]));
			}
		}

		$("body").append(dialogDiv);
		
		
		$("div.candidate").click(function() {
			var link = $(this).data("link");
			
			if(link !== null) {
				window.location = link;
			}
		});
		
		$("#candidateDialog").dialog({
			  minHeight: 700,
			  width: '100%'
			});
	});
}

//Leaving this here will open the dialog again on subsequent clicks of the bookmark
$("#candidateDialog").dialog({
			  minHeight: 700,
			  width: '100%'
			});

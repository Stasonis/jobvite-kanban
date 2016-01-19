
if(typeof window.jobviteKanbanLoaded == "undefined") {

	window.jobviteKanbanLoaded = true;
	
	//Test Comment
	var candidates = $("#jv-searchCandidateGrid tr").not("#jv-gridHeader").map(function(key, item) {
							var obj = {};
							obj.link = $(item).find(".jv-candidateName a").attr("href");
							obj.name = $(item).find(".jv-candidateName a").text().trim();
							obj.status = $(item).find(".jv-candidateStatus a.candidateStatusValue").text().trim();
							obj.source = $(item).find(".jv-candidateSource").text().trim();
							obj.lastActivity = Date.parse($(item).find(".jv-candidateActivity").text().trim());
	
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

	var statusOrder = ["New", "Resume Reviewed", "Recruiting Screen", "Hiring Manager Phone Interview", "Approved by Hiring Manager"]

	var dialogDiv = $("<div style='width: 500px;'>");

	var table = $("<table>");
	dialogDiv.append(table);

	var headerRow = $("<tr>");
	table.append(headerRow);

	for(i = 0; i < statusOrder.length; i++) {
		headerRow.append("<th>" + statusOrder[i] + "</th>");
	}

	var candidateRow = $("<tr>");
	table.append(candidateRow);

	for(i = 0; i < statusOrder.length; i++) {

		var statusColumn = $("<td>");
		candidateRow.append(statusColumn);
	
		if(typeof candidatesByStatus[statusOrder[i]] == "undefined") continue;
	
		var statusCandidates = candidatesByStatus[statusOrder[i]];
	
		for(j = 0; j < statusCandidates.length; j++) {
			statusColumn.append(statusCandidates[j].name);
		}
	}

	$("body").append(dialogDiv);
	dialogDiv.dialog();
}
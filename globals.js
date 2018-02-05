/**
 * @properties={typeid:35,uuid:"E1DA4565-B206-4C45-A8FD-25412410E223",variableType:-4}
 */
var MAGNACARTA = 
{
	DL_URL: 'https://magnacarta.studiomiazzo.it/Documenti/Download.aspx?idDocumento=',
	HOME_URL: 'https://magnacarta.studiomiazzo.it',
	LOGIN_URL: 'https://magnacarta.studiomiazzo.it/Login.aspx',
	AUTH_COOKIE: '.ASPXFORMSAUTH',
	AUTH_COOKIE_GENERIC: '.ASPXAUTH',
	SESSION_COOKIE: 'ASP.NET_SessionId',
	DOMAIN: 'magnacarta.studiomiazzo.it'
}

/**
 * @properties={typeid:24,uuid:"5F368D07-6F75-4DE4-94BB-A2160EC64916"}
 */
function ma_mc_scaricaDocumento(file_id)
{
	try
	{
		var url = globals.MAGNACARTA.DL_URL + file_id;
		var client = globals.getHttpClient();
		
		var isAuthenticated = globals.ma_mc_isAuthenticated(client) || globals.ma_mc_loginToMagnacarta('stmiazzo', 'Wlfeclc69');
		if(!isAuthenticated)
			throw new Error('Errore durante l\'autenticazione al server magnacarta');
		
		var request = client.createGetRequest(encodeURI(url));
			request.addHeader('Host', 'magnacarta.studiomiazzo.it');
			request.addHeader('Cache-Control', 'no-cache');
			
		var response = request.executeRequest();
		
		if(!response)
			throw new Error('Errore durante lo scaricamento del file, id ' + file_id);
		
		if(response.getStatusCode() !== globals.HTTPStatusCode.OK)
			throw new Error('Errore durante lo scaricamento del file, id ' + file_id + '\nResponse code: ' + response.getStatusCode() + '\n' + response.getResponseBody());
		
		var file = response.getMediaData();
		if(!file)
			throw new Error('Documento non disponibile o autorizzazioni non sufficienti, id ' + file_id);
		
		if(file.length === 0)
			throw new Error('File vuoto, id ' + file_id + '\nResponse code: ' + response.getStatusCode() + ', ' + response.getResponseBody());
		
		return file;
	}
	catch(error)
	{
		globals.ma_utl_logError(error);
		return null;
	}
}

/**
 * @properties={typeid:24,uuid:"F249D826-2EC6-4A94-BB57-CCA35A086EDC"}
 */
function ma_mc_loginToMagnacarta(username, password)
{
	var client = globals.getHttpClient();
	var url = globals.MAGNACARTA.LOGIN_URL;
	
	var request = client.createGetRequest(encodeURI(globals.MAGNACARTA.LOGIN_URL));
		request.addHeader('Host', 'magnacarta.studiomiazzo.it');
		
	var response = request.executeRequest();
	if(!response)
		return false;
	
	var responseBody = response.getResponseBody();
	if(response.getStatusCode() !== globals.HTTPStatusCode.OK || !responseBody)
		return false;
	
	/** @type {String}*/
	var viewstate = /<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="(.*)" \/>/.exec(responseBody.replace("\\", ""))[1];
	if(!viewstate)
		return false;
	
	var content = "__VIEWSTATE=" + encodeURIComponent(viewstate)
				+ "&" + encodeURIComponent("ctl00$phPlaceHolder$UserName")   + "=" + username
				+ "&" + encodeURIComponent("ctl00$phPlaceHolder$Password")   + "=" + password
				+ "&" + encodeURIComponent("ctl00$phPlaceHolder$Login")      + "=" + "Accedi"
				+ "&" + encodeURIComponent("ctl00$phPlaceHolder$RememberMe") + "=" + "on";

	request = client.createPostRequest(encodeURI(url));
	request.addHeader('Host', 'magnacarta.studiomiazzo.it');
	request.addHeader('Content-Type', 'application/x-www-form-urlencoded');  
	request.addHeader('Cache-Control', 'no-cache');
	request.setBodyContent(content);
	
	response = request.executeRequest();
	if(response.getStatusCode() !== globals.HTTPStatusCode.OK || !ma_mc_isAuthenticated(client))
		return false;
	
	/**
	 * Consume the body, otherwise the connection cannot be reused
	 */
	response.getResponseBody();
	
	return true;
}

/**
 * @return {Cookie}
 * 
 * @properties={typeid:24,uuid:"4CF727B9-616D-48BF-AA42-9F2039EB0B2E"}
 */
function ma_mc_isAuthenticated(client)
{
	/** @type {Cookie} */
	var cookie = client.getCookie(globals.MAGNACARTA.AUTH_COOKIE) || client.getCookie(globals.MAGNACARTA.AUTH_COOKIE_GENERIC);
	if (cookie.getDomain() === globals.MAGNACARTA.DOMAIN)
		return cookie;
	
	return null;
}
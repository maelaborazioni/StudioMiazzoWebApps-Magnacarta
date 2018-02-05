/**
 * @type {String}
 * 
 * @properties={typeid:35,uuid:"4DB709F8-55B6-445B-8115-2FC4B0CDA657"}
 */
var vPasswordCheck = null;

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"45783774-8E36-485B-A296-7226AEBB803E"}
 */
function cancel(event) 
{
	databaseManager.rollbackTransaction();
	globals.svy_mod_closeForm(event);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"949BDF37-3500-4F18-8650-89B3C2324BDE"}
 */
function confirm(event) 
{
// TODO metodo mantenuto ma non attivo	
//	if(!vPasswordCheck)
//		globals.ma_utl_showErrorDialog('<strong>Password obbligatoria</strong>');
//	else
//	if(sec_user_to_sec_usertomagnacarta.password !== vPasswordCheck)
//		globals.ma_utl_showErrorDialog('<strong>Le password non corrispondono, controllare</strong>');
//	else
//	{
//		databaseManager.commitTransaction();
//		globals.svy_mod_closeForm(event);
//	}
}

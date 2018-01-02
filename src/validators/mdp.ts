import { FormControl } from '@angular/forms';

export class MdpValidator
{
	static passwordsMatch(ctrl: FormControl):  any
	{
		if(ctrl.value == ctrl.root.value['mdp1']) return null;
		else return { "non identiques": true};
	}

	static missmatchNames(ctrl: FormControl):  any
	{
		if(ctrl.value == ctrl.root.value['nom']) return { "identiques": true};
		else return null;
	}
   

}

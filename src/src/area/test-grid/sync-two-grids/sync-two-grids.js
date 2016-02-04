import {customElement, inject} from 'aurelia-framework';
import {Http, Logger} from 'service';
import {I18N} from 'aurelia-i18n';

@customElement('types-roles-privileges')
@inject(Http, Logger, I18N)
export class SyncTwoGrids {
  constructor(http, logger, i18n) {
    this.http = http;
    this.logger = logger;
    this.i18n = i18n;

    this.selectedUserType = {roles: [], remainingRoles: []};
    this.selectedRole = {privileges: [], remainingPrivileges: []};
    this.selectedPrivilege = {roles: [], userTypes: []};

    this.userTypes = [
      {id: "afce36e2-bc1b-46c0-bcb2-5f4ff3b3f11b", name: "UT Monroe"},
      {id: "d26969da-f4d8-4ed0-a43e-86ef4971b5bf", name: "UT Miriam"},
      {id: "10048133-4ed2-477d-acc7-495ce63e02b0", name: "UT Cherry"},
      {id: "2f6e25f3-f911-4271-be24-a4311fea860b", name: "UT Julia"},
      {id: "2d0f339c-58fe-4ec0-9b54-54713a1d6f10", name: "UT Janice"},
      {id: "9d7ea42d-16d3-428e-831d-53692dc495e4", name: "UT Jody"},
      {id: "cf84ab1f-23a1-4023-ac77-8bd0912aa303", name: "UT Fischer"},
      {id: "3e65a78e-1cb9-4bf5-bb64-647b7ecb2740", name: "UT Trina"},
      {id: "599602ef-d90b-4aba-9680-e5e6c32e98b1", name: "UT Joyce"},
      {id: "ecec7fd2-caf2-41f8-8f04-a610712d3c49", name: "UT Ayers"},
      {id: "1ce5db05-9ba1-45fa-bb35-9ca2a76a41fb", name: "UT Dennis"},
      {id: "c916c2de-a7de-432e-9140-37626c904abe", name: "UT Russell"},
      {id: "e9b3ca54-30fc-4335-9e8f-1f654208951d", name: "UT Guthrie"},
      {id: "806a0c1d-1586-4732-9bd2-4df8bb1fdc71", name: "UT Puckett"},
      {id: "414c0691-9f7a-49d9-bde1-09874c7aa3b8", name: "UT Walker"},
      {id: "2dcd07b3-ac19-442d-9720-a8c6b69e8294", name: "UT Ware"},
      {id: "2bd85f7f-9c49-4567-acb9-4280dfcda148", name: "UT Kelly"},
      {id: "729bfc53-8ff5-4b39-8045-b8b7396dd2ec", name: "UT Haney"},
      {id: "d7f6e094-5add-4969-9c12-2c672f8abc4a", name: "UT Durham"},
      {id: "5c89b4cf-84d9-4b52-bbb2-bdc5daffbb76", name: "UT Love"}
    ];

    this.roles = [
      {id: "3a774e60-12b5-44bd-8875-49c492c11e97", name: "Role Gallagher"},
      {id: "8c9e3f95-657a-4fd4-b3dc-32072cf72782", name: "Role Strong"},
      {id: "2f05d8ed-d4ca-4c1f-bfc7-fd49f1df8f6a", name: "Role Bernadine"},
      {id: "0aae506b-199b-4c4e-b476-92a8b980a137", name: "Role Samantha"},
      {id: "637dd541-0cbc-453a-bed9-5898ab037552", name: "Role Downs"},
      {id: "ac70148e-a099-4ffe-b122-67e7a479cf03", name: "Role Ramsey"},
      {id: "04a5b44a-b793-4b69-9654-cfae87e97d2a", name: "Role Glenn"},
      {id: "0f428ff1-1fd9-4cce-881b-61822ceb1e97", name: "Role Verna"},
      {id: "20995126-26a5-4f4f-a933-a31bcee07f1e", name: "Role Cleveland"},
      {id: "b6d147af-fd14-47d9-9f71-fe2ca75750fe", name: "Role Fields"},
      {id: "1b762e8d-1fe5-4996-aa2f-6ef29b41f568", name: "Role Britney"},
      {id: "6d61d66b-7928-435d-8429-656de503d1e8", name: "Role Frankie"},
      {id: "627b8371-5828-4b79-90ba-5f1dbb0cb27a", name: "Role Isabella"},
      {id: "376b00a9-0cb8-4e58-893c-9819d3ae2674", name: "Role Kane"},
      {id: "8d210bac-23ba-45b2-b8eb-d733b167f9db", name: "Role Lamb"},
      {id: "a8521d9f-b762-453a-b213-be28a45781cb", name: "Role Parsons"},
      {id: "c3df0dc8-f40d-4a9e-a070-5668dfcbd238", name: "Role Owen"},
      {id: "b886555f-0087-4f1b-b1b8-27267bb24016", name: "Role Rush"},
      {id: "084a987e-f1aa-4e59-a665-94646b96adfb", name: "Role Case"},
      {id: "95c32607-60ff-499e-89e1-840dbf5b0c51", name: "Role Latisha"}
    ];

    this.privileges = [
      {id: "aedfbf99-1fff-43da-8234-47bfd6f278d9", name: "Privilege Jeanie"},
      {id: "91a98558-bcce-4ea0-993b-19bc4d9905d0", name: "Privilege Valencia"},
      {id: "bab13139-3fed-433d-be73-239950b89a14", name: "Privilege Jacobs"},
      {id: "1ecc72dc-39a9-4ad1-86b0-c0e43f1b4a26", name: "Privilege Tiffany"},
      {id: "3ec0dccb-0478-4c04-b73a-867d06588b3d", name: "Privilege Tamika"},
      {id: "e3a4d6a4-8953-4699-acdc-7588652caa23", name: "Privilege Opal"},
      {id: "8c1b2ce3-109d-4498-aa79-84c0f56e3f11", name: "Privilege Collins"},
      {id: "a0a72f6e-e9da-408f-8884-b4402002c970", name: "Privilege Roxie"},
      {id: "593c3a53-33a2-4359-bcbc-da3746631978", name: "Privilege Hudson"},
      {id: "380e4a0c-ee84-41ae-a591-89bb59ac2286", name: "Privilege Lupe"},
      {id: "0fdecfc4-2351-44c4-b43c-9c4ab85b6eec", name: "Privilege Hardy"},
      {id: "d4c15f10-6ea0-4f16-a042-77bfb18d8fb0", name: "Privilege Helene"},
      {id: "0243fc7e-2638-4c35-b023-ad0795ec5ed5", name: "Privilege Cheryl"},
      {id: "7dcaa439-2009-4a70-953c-5ca07a9f1f09", name: "Privilege Kellie"},
      {id: "9a6c2cc7-8092-46a9-ab6f-0d5e93773b5e", name: "Privilege Knapp"},
      {id: "0ad32f47-260d-40b7-a512-3fae9f7ea5cb", name: "Privilege Justine"},
      {id: "13b669b9-fbf9-4e81-a296-1e01f6a76973", name: "Privilege Page"},
      {id: "a0df51a7-527e-47b9-80cd-faf026f2347e", name: "Privilege Joanne"},
      {id: "2b517448-240e-433a-b81b-25b95652f449", name: "Privilege Rivers"},
      {id: "160b5878-22b0-4003-91c4-a444ef05825f", name: "Privilege Phillips"}
    ];

    this.onUserTypeSelect(this.userTypes[0]);
    this.onRoleSelect(this.roles[0]);
    this.onPrivilegeSelect(this.privileges[0]);

  }

  onUserTypeSelect(userType) {
    this.selectedUserType = userType;

    let roleIds = this._getRandomNumbers(0, this.roles.length);
    this.selectedUserType.roles = [];
    this.selectedUserType.remainingRoles = [];
    for (let index = 0; index < this.roles.length; index++) {
      if (roleIds.indexOf(index) > -1) {
        this.selectedUserType.roles.push(this.roles[index]);
      } else {
        this.selectedUserType.remainingRoles.push(this.roles[index]);
      }
    }
  }

  onUserTypeDeselect(userType) {
    this.selectedUserType = {roles: [], remainingRoles: []};
  }

  onRoleSelect(role) {
    this.selectedRole = role;

    let privilegeIds = this._getRandomNumbers(0, this.privileges.length);
    this.selectedRole.privileges = [];
    this.selectedRole.remainingPrivileges = [];
    for (let index = 0; index < this.privileges.length; index++) {
      if (privilegeIds.indexOf(index) > -1) {
        this.selectedRole.privileges.push(this.privileges[index]);
      } else {
        this.selectedRole.remainingPrivileges.push(this.privileges[index]);
      }
    }
  }

  onRoleDeselect() {
    this.selectedRole = {privileges: [], remainingPrivileges: []};
  }

  onPrivilegeSelect(privilege) {
    this.selectedPrivilege = privilege;

    let rolesIds = this._getRandomNumbers(0, this.roles.length);
    this.selectedPrivilege.roles = [];
    for (let index of rolesIds) {
      this.selectedPrivilege.roles.push(this.roles[index]);
    }

    let userTypesIds = this._getRandomNumbers(0, this.userTypes.length);
    this.selectedPrivilege.userTypes = [];
    for (let index of userTypesIds) {
      this.selectedPrivilege.userTypes.push(this.userTypes[index]);
    }
  }

  onPrivilegeDeselect(privilege) {
    this.selectedPrivilege = {roles: [], userTypes: []};
  }

  addUserTypeRole(role) {
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.oneRoleAddedToUserType'));
  }

  removeUserTypeRole(role) {
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.oneRoleRemovedFromUserType'));
  }

  addUserTypeAllRoles() {
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.allRolesAddedToUserType'));
  }

  removeUserTypeAllRoles() {
    //this.selectedUserType.roles = [];
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.allRolesRemovedFromUserType'));
  }

  addRolePrivilege(privilege) {
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.onePrivilegeAddedToRole'));
  }

  removeRolePrivilege(privilege) {
    //this.selectedRole.privileges.splice(this.privileges.indexOf(privilege), 1);
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.onePrivilegeRemovedFromRole'));
  }

  addRoleAllPrivileges() {
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.allPrivilegesAddedToRole'));
  }

  removeRoleAllPrivileges() {
    //this.selectedRole.privileges = [];
    this.logger.success(this.i18n.tr('management.userManagement.typesRolesPrivileges.allPrivilegesRemovedFromRole'));
  }

  _getRandomNumbers(min, max, maxCount) {
    let count = this._getRandomNumber(0, maxCount || max);
    let numbers = [];
    for (let i = 0; i < count; i++) {
      let number = this._getRandomNumber(min, max);
      if (numbers.indexOf(number) > -1) {
        i--;
        continue;
      }

      numbers.push(number);
    }

    return numbers;
  }

  _getRandomNumber(min, max) {
    return Math.floor((Math.random() * max) + min);
  }
}

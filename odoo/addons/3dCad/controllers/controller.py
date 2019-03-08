from odoo import http, api, tools, fields
from odoo.http import request,  serialize_exception as _serialize_exception, Response

import  base64

class Main(http.Controller):

    @http.route('/3dCad/render/<product_id>', methods=['GET'], auth='user', website=True)
    def render(self, product_id, **kwargs):
        return request.render("3dCad.threejs_main_view", {'main_product_product_id': product_id})
#     
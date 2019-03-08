


{
    'name': '3dCad',
    'version': '12.0',
    'author': 'OmniaSolutions.website',
    'maintainer': 'OmniaSolutions.website',
    'summary': 'Manage Cad Data into Odoo',
    'website': 'https://www.omniasolutions.website',
    'category': 'plm',
    'description':
                """
                    Manage 3d object inside odoo
                """,

    'depends': ['plm'],
    'data': ['views/assets.xml',
             'views/templates.xml'],   
    'qweb': ['static/xml/templates.xml'],
    'application': False,
    'installable': True,
    'auto_install': True,
}

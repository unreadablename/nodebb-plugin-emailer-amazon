<h1><i class="fa fa-envelope-o"></i> Emailer (Amazon SES)</h1>

<div class="row">
	<div class="col-lg-12">

	</div>
</div>

<hr />

<form role="form" class="emailer-settings">
	<fieldset>
		<div class="row">
			<div class="col-sm-6">
				<div class="form-group">
					<label for="apiKey">API Key</label>
					<input type="text" class="form-control" id="apiKey" name="apiKey" />
				</div>
			</div>
			<div class="col-sm-6">
				<div class="form-group">
					<label for="apiSecret">API Secret</label>
					<input type="text" class="form-control" id="apiSecret" name="apiSecret" />
				</div>
			</div>
		</div>

		<button class="btn btn-lg btn-primary" id="save" type="button">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['settings'], function(Settings) {
		Settings.load('amazon-ses', $('.emailer-settings'));

		$('#save').on('click', function() {
			Settings.save('amazon-ses', $('.emailer-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'amazon-ses-saved',
					title: 'Settings Saved',
					message: 'Click here to reload NodeBB',
					timeout: 2500,
					clickfn: function() {
						socket.emit('admin.reload');
					}
				});
			});
		});
	});
</script>
